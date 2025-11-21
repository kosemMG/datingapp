import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from '../member-card/member-card';
import { PaginatedResult, Pagination } from '../../../types/pagination';
import { Paginator } from '../../../shared/paginator/paginator';
import { FilterModal } from '../filter-modal/filter-modal';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html'
})
export class MemberList implements OnInit {
  @ViewChild(FilterModal) modal!: FilterModal;
  protected members = signal<Member[] | null>([]);
  protected metadata = signal<Pagination | null>(null);

  private readonly memberService = inject(MemberService);
  protected memberParams = new MemberParams();
  private updatedParams = new MemberParams();

  protected get selectedFilters(): string {
    const defaultParams = new MemberParams();
    const filters: string[] = [];
    const { gender, minAge, maxAge, orderBy } = this.updatedParams;

    filters.push(!!gender ? gender + 's' : 'Males, Females');

    if (minAge !== defaultParams.minAge || maxAge !== defaultParams.maxAge) {
      filters.push(` ages ${minAge}-${maxAge}`);
    }

    filters.push(orderBy === 'lastActive' ? 'Recently active' : 'Newest members');

    return filters.length ? `Selected: ${filters.join('  | ')}` : 'All members';
  }

  constructor() {
    const filters = localStorage.getItem('filters');
    if (filters) {
      const filterParams: MemberParams = JSON.parse(filters);
      this.memberParams = filterParams;
      this.updatedParams = filterParams;
    }
  }

  public ngOnInit(): void {
    this.loadMembers();
  }

  protected onPageChange(event: { pageNumber: number, pageSize: number }) {
    this.memberParams.pageNumber = event.pageNumber;
    this.memberParams.pageSize = event.pageSize;
    this.loadMembers();
  }

  protected openModal(): void {
    this.modal.open();
  }

  protected closeModal(): void {
    console.log('Modal closed');
  }

  protected onFilterChange(params: MemberParams): void {
    this.memberParams = { ...params };
    this.updatedParams = { ...params };
    this.loadMembers();
  }

  protected resetFilters(): void {
    this.memberParams = new MemberParams();
    this.updatedParams = new MemberParams();
    localStorage.removeItem('filters');
    this.loadMembers();
  }

  private loadMembers(): void {
    this.memberService.getMembers(this.memberParams).subscribe((result: PaginatedResult<Member>) => {
      this.members.set(result.items);
      this.metadata.set(result.metadata);
    });
  }
}
